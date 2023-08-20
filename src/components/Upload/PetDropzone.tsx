/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { clsx } from 'clsx';
import { Image, Trash } from 'lucide-react';
import Dropzone, { Accept } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { DropzoneFile, LIMIT_IMAGE_QUANTITY } from '../Form/RegisterPetForm';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ConfirmationDialog } from '../ConfirmationDialog';

type PetDropzoneProps = {
  files: DropzoneFile[];
  handleAddFiles: (files: DropzoneFile[]) => void;
  handleRemoveFile: (file: DropzoneFile) => Promise<void>;
  cover: DropzoneFile | null;
  setCover: (cover: DropzoneFile) => void;
};

const accept: Accept = {
  'image/*': ['.png', '.jpeg', '.jpg'],
};

export function PetDropzone({
  files,
  handleAddFiles,
  handleRemoveFile,
  cover,
  setCover,
}: PetDropzoneProps) {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        const adds: DropzoneFile[] = acceptedFiles.map((file) =>
          Object.assign(file, {
            urlPathFromServer: null,
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
          {files.length < LIMIT_IMAGE_QUANTITY && (
            <div
              {...getRootProps()}
              className="w-full h-[200px] border-dashed border-zinc-400 border bg-zinc-200 rounded-lg flex items-center justify-center"
            >
              <input {...getInputProps()} />

              <div className="flex xs:flex-col lg:flex-row xs:items-start lg:items-center gap-4 xs:p-10">
                <Image className="w-14 h-14 text-green-600" strokeWidth={1} />
                <div>
                  <p>Clique ou arraste para adicionar imagens...</p>
                  <p className="text-xs text-zinc-500">
                    Limite de 6 imagens PNG, JPG, JPEG até no máximo 5MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <aside className="w-full  flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-lg text-green-700">
                  Imagens adicionadas
                </span>
                <div className="flex xs:flex-col lg:flex-row xs:gap-4 lg:items-center lg:justify-between mt-5">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    Clique em <Image className="w-5 h-5" /> para mudar a imagem
                    de capa
                  </span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    Clique em <Trash className="w-5 h-5" /> para excluir a
                    imagem
                  </span>
                </div>
              </div>

              <div className="grid xs:grid-cols-1 lg:grid-cols-3 gap-6 xs:mt-4 lg:mt-0">
                {files.map((file, index) => (
                  <div
                    key={`${file.name} - ${index}`}
                    className={clsx(
                      'flex items-center justify-center relative rounded-lg ring-8 ',
                      {
                        ' ring-green-300 ': file.name === cover?.name,
                        'ring-transparent': file.name !== cover?.name,
                      }
                    )}
                  >
                    {file.name === cover?.name && (
                      <span className="flex items-center gap-2 absolute top-0 right-0 bg-green-500 py-1 px-2 rounded-tr rounded-bl text-zinc-50 text-sm">
                        <Image strokeWidth={1} className="w-5 h-5" /> Imagem de
                        Capa
                      </span>
                    )}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="block w-[300px] h-[300px] object-cover rounded-lg"
                      // Revoke data uri after image is loaded
                      onLoad={() => {
                        URL.revokeObjectURL(file.name);
                      }}
                    />

                    {file.name !== cover?.name && (
                      <button
                        type="button"
                        className="bg-green-500 p-2 rounded absolute bottom-0 left-0"
                        onClick={() => setCover(file)}
                      >
                        <Image
                          strokeWidth={1}
                          className="w-6 h-6 text-zinc-50"
                        />
                      </button>
                    )}

                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <button
                          type="button"
                          className="bg-green-600 p-2 rounded absolute bottom-0 right-0"
                        >
                          <Trash
                            strokeWidth={1}
                            className="w-6 h-6 text-zinc-50"
                          />
                        </button>
                      </AlertDialog.Trigger>
                      <ConfirmationDialog
                        question="Tem certeza que deseja remover a imagem?"
                        message="Ao remover a imagem, ela não estará mais associada ao pet."
                        onConfimation={() => handleRemoveFile(file)}
                      />
                    </AlertDialog.Root>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </section>
      )}
    </Dropzone>
  );
}
