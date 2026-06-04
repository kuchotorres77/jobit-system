interface Props {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export const JobitInputControlado = ({
    label,
    type = "text",
    value,
    onChange,
  }: Props) => {
    return (
      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md p-2 outline-none
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    );
  };
  