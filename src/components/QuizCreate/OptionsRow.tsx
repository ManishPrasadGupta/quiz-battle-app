"use client";

type Props = {
  name: string;
  label: string;
  checked: boolean;
  value: string;
  onCheck: () => void;
  onChange: (v: string) => void;
};

export default function OptionRow({
  name,
  label,
  checked,
  value,
  onCheck,
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onCheck}
        className="text-blue-500"
      />
      <span className="text-sm text-gray-600 w-6">{label}.</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Option ${label}`}
        className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </div>
  );
}
