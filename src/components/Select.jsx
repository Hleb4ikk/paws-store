import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Select({ children, ...props }) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

export function SelectTrigger({ children, className = '', ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={`flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${className}`}
      {...props}
    >
      <SelectPrimitive.Value>{children}</SelectPrimitive.Value>
      <SelectPrimitive.Icon>
        <ChevronDown size={16} className="text-gray-500" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ children, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50"
        position="popper"
        sideOffset={5}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
          <ChevronUp size={16} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
          <ChevronDown size={16} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ children, value, ...props }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-orange-50 focus:bg-orange-50 outline-none select-none data-[highlighted]:bg-orange-50"
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
