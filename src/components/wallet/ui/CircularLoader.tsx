import useConfig from "../../../hooks/useConfig";
import { cn } from "../../../utils/cn";

interface IProps {
  className?: string;
}

const CircularLoader = ({ className }: IProps) => {
  const { circularLoaderColor } = useConfig();
  
  return (
    <div className="mx-auto flex items-center justify-center bg-transparent">
      <div
        className={cn(
          "size-10 animate-spin rounded-full border-4 border-solid border-transparent",
          className,
          circularLoaderColor
        )}
      ></div>
    </div>
  );
};

export default CircularLoader;
