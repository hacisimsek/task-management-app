const Alert = ({ variant, children }) => (
    <div className={`p-4 rounded ${variant === 'destructive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {children}
    </div>
  );
  
  export default Alert;
  