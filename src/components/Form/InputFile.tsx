/* eslint-disable jsx-a11y/alt-text */
import { Image } from 'lucide-react';
import {
  ChangeEvent,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  forwardRef,
  useState,
} from 'react';
import { FieldError } from 'react-hook-form';

type InputProps = {
  name: string;
  error?: FieldError;
} & InputHTMLAttributes<HTMLInputElement>;

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, error = null, ...rest },
  ref
) => {
  const [preview, setPreview] = useState<string | null>(null);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    console.log(files);

    if (!files) {
      return;
    }

    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <label htmlFor={name} className="flex items-center gap-6 w-max">
          {preview ? (
            <img
              src={preview}
              alt=""
              className="w-[128px] h-[128px] rounded-full bg-zinc-200 border-dashed border-gray-500 border object-cover"
            />
          ) : (
            <div className="w-[128px] h-[128px] rounded-full bg-zinc-200 border-dashed border-gray-500 border flex items-center justify-center">
              <Image className="w-14 h-14 text-green-600" strokeWidth={1} />
            </div>
          )}

          <div className="w-[230px] flex flex-col gap-2">
            <span className="text-green-700 text-2xl leading-6 font-medium tracking-tight">
              Foto de perfil
            </span>
            <p className="text-base leading-tight text-green-600">
              Faça o upload da foto de perfil da sua organização
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG até no máximo 2MB
            </p>
          </div>
        </label>

        <input
          name={name}
          id={name}
          type="file"
          accept="image/*"
          className="invisible h-0 w-0"
          ref={ref}
          onChange={onFileSelected}
          {...rest}
        />
      </div>
      {!!error && (
        <span className="text-xs text-zinc-700">{error.message}</span>
      )}
    </div>
  );
};

export const InputFile = forwardRef(InputBase);
