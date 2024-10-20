const Select = ({ value, onChange, children }) => (
    <select
      className="border rounded p-2 w-full"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
  
  export default Select;
  