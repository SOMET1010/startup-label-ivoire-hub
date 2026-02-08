import { useState } from "react";
import { Zap, ChevronDown, ChevronUp, Shield, Rocket, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TestAccount {
  role: string;
  email: string;
  password: string;
  icon: React.ElementType;
  color: string;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    role: "Admin",
    email: "admin-test@label-ia.ci",
    password: "AdminTest2026!",
    icon: Shield,
    color: "bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20",
  },
];

interface DevQuickLoginProps {
  onQuickLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export default function DevQuickLogin({ onQuickLogin, isLoading }: DevQuickLoginProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!import.meta.env.DEV) return null;

  return (
    <Card className="mt-4 border-2 border-dashed border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-500/40">
      <CardContent className="py-3 px-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Dev Quick Login
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-amber-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {isOpen && (
          <div className="mt-3 space-y-2">
            {TEST_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              return (
                <Button
                  key={account.email}
                  type="button"
                  variant="outline"
                  className={`w-full justify-start gap-3 h-10 text-sm ${account.color}`}
                  disabled={isLoading}
                  onClick={() => onQuickLogin(account.email, account.password)}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{account.role}</span>
                  <span className="text-xs opacity-70 ml-auto">{account.email}</span>
                </Button>
              );
            })}
            <p className="text-[10px] text-amber-600/70 dark:text-amber-400/50 text-center mt-1">
              Visible uniquement en mode développement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
