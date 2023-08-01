type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <span className="text-xs font-medium text-red-500">{message}</span>;
}
