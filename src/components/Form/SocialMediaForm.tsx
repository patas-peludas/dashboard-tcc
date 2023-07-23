import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from './Input';
import { Spinner } from '../Spinner';
import { Save } from 'lucide-react';

type SocialFormData = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
};

export function SocialMediaForm() {
  const { register, handleSubmit, formState } = useForm<SocialFormData>();

  const { errors, isSubmitting } = formState;

  const handleSocial: SubmitHandler<SocialFormData> = async (values) => {
    console.log(values);
  };

  return (
    <div className="mb-5 bg-zinc-50 p-5 rounded-[20px] flex flex-col gap-1 w-full">
      <h4 className="text-green-800 text-[18px] font-bold leading-8 tracking-tight">
        Link das Redes Sociais
      </h4>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(handleSocial)}
      >
        <Input
          label="Instagram"
          {...register('instagram')}
          error={errors.instagram}
        />

        <Input
          label="Facebook"
          {...register('facebook')}
          error={errors.facebook}
        />

        <Input
          label="Twitter"
          {...register('twitter')}
          error={errors.twitter}
        />

        <Input
          label="Linkedin"
          {...register('linkedin')}
          error={errors.linkedin}
        />

        <button
          type="submit"
          className="w-max bg-leaf py-3 px-4 rounded hover:brightness-90 transition-colors mt-5 self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            <span className="flex items-center gap-2 text-white">
              <Save strokeWidth={1} /> Salvar
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
