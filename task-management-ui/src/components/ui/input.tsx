const Input = ({ value, onChange, placeholder }) => (
    <input
      className="border rounded p-2 w-full"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
  
  export default Input;
  