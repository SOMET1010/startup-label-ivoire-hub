
import { useBrand, Brand } from '@/hooks/useBrand';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Rocket } from 'lucide-react';

export function BrandSwitcher() {
  const { brand, setBrand, allBrands } = useBrand();

  return (
    <Select value={brand} onValueChange={(value: Brand) => setBrand(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choisir le thème" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ivoirehub">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <span>{allBrands.ivoirehub.name}</span>
          </div>
        </SelectItem>
        <SelectItem value="ansut">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{allBrands.ansut.name}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export function BrandToggle() {
  const { brand, toggleBrand, brandInfo } = useBrand();

  return (
    <button
      onClick={toggleBrand}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium 
                 bg-muted hover:bg-muted/80 transition-colors border border-border"
      title={`Thème actuel: ${brandInfo.name}. Cliquez pour changer.`}
    >
      {brand === 'ivoirehub' ? (
        <Rocket className="h-4 w-4" />
      ) : (
        <Building2 className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">{brandInfo.name}</span>
    </button>
  );
}
