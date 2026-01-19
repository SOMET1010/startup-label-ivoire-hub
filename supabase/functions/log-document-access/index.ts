import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AccessLogEntry {
  document_path: string;
  access_type: 'preview' | 'download' | 'share' | 'evaluation';
  access_result: 'success' | 'error' | 'denied';
  startup_id?: string;
  application_id?: string;
  error_message?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Client to get user info
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: AccessLogEntry = await req.json();

    if (!body.document_path || !body.access_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: document_path, access_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    // Extract document type from path
    const documentType = extractDocumentType(body.document_path);

    // Get client info
    const ipAddress = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Insert log entry using service role (bypasses RLS for insert)
    const { error: insertError } = await supabaseAdmin
      .from('document_access_logs')
      .insert({
        user_id: user.id,
        user_role: roleData?.role || 'unknown',
        document_path: body.document_path,
        document_type: documentType,
        access_type: body.access_type,
        access_result: body.access_result || 'success',
        startup_id: body.startup_id || null,
        application_id: body.application_id || null,
        ip_address: ipAddress.split(',')[0].trim(), // Get first IP if multiple
        user_agent: userAgent.substring(0, 500), // Limit user agent length
        error_message: body.error_message || null,
      });

    if (insertError) {
      console.error('Failed to insert audit log:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to log access' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in log-document-access:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractDocumentType(path: string): string {
  // Extract document type from path like "startup-id/doc_rccm.pdf"
  const docTypes: Record<string, string> = {
    'doc_rccm': 'RCCM',
    'doc_tax': 'Attestation fiscale',
    'doc_statutes': 'Statuts',
    'doc_business_plan': 'Business Plan',
    'doc_cv': 'CV Fondateur',
    'doc_pitch': 'Pitch Deck',
    'doc_other': 'Autre document',
  };

  for (const [key, label] of Object.entries(docTypes)) {
    if (path.toLowerCase().includes(key.toLowerCase())) {
      return label;
    }
  }

  // Try to extract from filename
  const fileName = path.split('/').pop() || path;
  return fileName.replace(/\.[^/.]+$/, ''); // Remove extension
}
