import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

export function Select({ value, onValueChange, children }) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      {children}
    </RadixSelect.Root>
  );
}

export function SelectTrigger({ className = '', children }) {
  return (
    <RadixSelect.Trigger
      className={`flex items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${className}`}
    >
      <RadixSelect.Value />
      <RadixSelect.Icon>
        <ChevronDown size={14} className="text-gray-500" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
}

export function SelectContent({ children }) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
        position="popper"
        sideOffset={4}
      >
        <RadixSelect.Viewport className="p-1">
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
}

export function SelectItem({ value, children }) {
  return (
    <RadixSelect.Item
      value={value}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-gray-700 outline-none hover:bg-orange-50 hover:text-orange-600 data-[state=checked]:text-orange-600 data-[state=checked]:font-medium"
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute right-2">
        <Check size={12} className="text-orange-500" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
}
