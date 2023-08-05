type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <span className="flex text-xs font-medium leading-snug text-red-500 mt-1">
      {message}
    </span>
  );
}
