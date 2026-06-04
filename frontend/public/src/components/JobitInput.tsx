interface Props {
    label: string;
    register: any;
    name: string;
    type?: string;
};

export const JobitInput = ({ label, register, name, type = "text" }: Props) => {
    return (
        <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">{label}</label>
            <input
                {...register(name)}
                type={type}
                className="w-full border rounded-md p-2 outline-none focus:border-blue-50 focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );
}
