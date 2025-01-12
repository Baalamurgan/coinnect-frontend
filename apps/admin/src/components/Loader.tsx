interface Props {
  className?: string;
  innerClassName?: string;
}

const Loader = ({ className = '', innerClassName = '' }: Props) => {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`}>
      <div
        className={`h-20 w-20 animate-spin rounded-full border-t-4 border-white ${
          innerClassName ?? ''
        }`}
      ></div>
    </div>
  );
};

export default Loader;
