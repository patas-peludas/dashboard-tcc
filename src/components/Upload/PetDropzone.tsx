/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { clsx } from 'clsx';
import { Image } from 'lucide-react';
import { useEffect } from 'react';
import Dropzone, { Accept } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { DropzoneFile } from '../Form/RegisterPetForm';

type PetDropzoneProps = {
  files: DropzoneFile[];
  handleAddFiles: (files: DropzoneFile[]) => void;
  cover?: DropzoneFile;
  setCover: (cover: DropzoneFile) => void;
};

const accept: Accept = {
  'image/*': ['.png', '.jpeg', '.jpg'],
};

export function PetDropzone({
  files,
  handleAddFiles,
  cover,
  setCover,
}: PetDropzoneProps) {
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  useEffect(() => {
    if (!cover) {
      setCover(files[0]);
    }
  }, [files]);

  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        const adds: DropzoneFile[] = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        handleAddFiles(adds);
      }}
      onDropRejected={() =>
        toast.custom(
          (t) => (
            <div
              className={`bg-red-500 px-6 py-4 shadow-md rounded-full flex flex-col gap-1 text-zinc-50 ${
                t.visible ? 'animate-enter' : 'animate-leave'
              }`}
            >
              <span className=" text-base font-semibold">
                Não foi possível completar a ação 🙁
              </span>
              <p className="text-xs">
                O arquivo é maior do que o esperado ou é de um tipo diferente.
              </p>
            </div>
          ),
          { position: 'bottom-right' }
        )
      }
      maxSize={5_242_888}
      accept={accept}
    >
      {({ getRootProps, getInputProps }) => (
        <section className="w-full flex flex-col gap-6">
          <div
            {...getRootProps()}
            className="w-full h-[200px] border-dashed border-zinc-400 border bg-zinc-200 rounded-lg flex items-center justify-center"
          >
            <input {...getInputProps()} />

            <div className="flex items-center gap-4">
              <Image className="w-14 h-14 text-green-600" strokeWidth={1} />
              <div>
                <p>Clique ou arraste para adicionar imagens...</p>
                <p className="text-xs text-zinc-500">
                  PNG, JPG, JPEG até no máximo 5MB
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <aside className="w-full  flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-lg text-green-700">
                  Imagens adicionadas
                </span>
                <span className="text-sm text-green-600">
                  *Clique em uma outra imagem para mudar a seleção da imagem de
                  capa, caso preferir.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {files.map((file) => (
                  <button
                    key={file.name}
                    className={clsx('flex items-center justify-center', {
                      'ring ring-green-500 rounded relative': file === cover,
                    })}
                    onClick={(e) => {
                      e.preventDefault();
                      setCover(file);
                    }}
                  >
                    {file === cover && (
                      <span className="flex items-center gap-2 absolute top-0 right-0 bg-green-600 py-1 px-2 rounded-tr rounded-bl text-zinc-50 text-sm">
                        <Image strokeWidth={1} className="w-5 h-5" /> Imagem de
                        Capa
                      </span>
                    )}
                    <img
                      src={file.preview}
                      className="block w-[250px] h-[250px] object-contain"
                      // Revoke data uri after image is loaded
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                      }}
                    />
                  </button>
                ))}
              </div>
            </aside>
          )}
        </section>
      )}
    </Dropzone>
  );
}
