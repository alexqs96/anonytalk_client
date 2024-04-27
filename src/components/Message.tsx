import { IMessage } from "@/lib/types";
import { adjustLuma, generateUniqueCode, openFileTab, parseTime } from "@/lib/utils";
import Image from "next/image";
import { Children } from "react";
import Linkify from "react-linkify";
import { FileIcon } from "./Icons";

function Content({ data }: { data: string[] }) {
  if (!data.length) {
    return null;
  }

  return (
    <>
      {Children.toArray(
        data?.map((file: string) => (
          <div className="my-2">
            {file.startsWith("data:image") ? (
              <Image
                onClick={() => openFileTab(file)}
                width={128.1}
                height={128.1}
                className="object-contain cursor-pointer w-full h-full max-w-[128px] md:max-w-[256px] max-h-[128px] md:max-h-[256px] bubble block mb-1 rounded-md"
                src={file}
                alt="Foto Anonima"
                unoptimized
              />
            ) : (
              <a
                href={file}
                className="flex items-center gap-1 w-fit text-black bg-[#00ff9d] cursor-pointer text-xs font-mono -tracking-wide py-1.5 px-3 rounded-md"
                download={"archivo_" + generateUniqueCode()}
              >
                <FileIcon className="fill-current w-[.9em]" /> Descargar {file.startsWith("data:application/pdf")? "PDF" : "Archivo"}
              </a>
            )}
          </div>
        )),
      )}
    </>
  );
}

function Message({ data }: { data: IMessage & { socket: string } }) {
  return (
    <div className="w-full">
      <div
        className={
          "flex items-center gap-1 w-fit" +
          (data.socket === data.id ? " mr-auto" : " ml-auto flex-row-reverse")
        }
      >
        <span
          title={data.author}
          className="text-[.85rem] font-bold capitalize max-w-[12ch] lg:max-w-[30ch] truncate block"
        >
          {data.author}{" "}
        </span>
        {data.socket === data.id ? (
            <span className="font-semibold opacity-70 text-[.7rem]">(tú)</span>
          ) : null}
        <span title={parseTime(data.time).long} className="text-[.7rem] opacity-70 hover:underline">{parseTime(data.time).short}</span>
      </div>
      <div
        style={{ backgroundColor: data.color, color: adjustLuma(data.color) }}
        className={
          "w-fit py-2 px-3.5 max-w-[80%] rounded-xl" +
          (data.author.length === 0
            ? " mx-auto"
            : data.socket === data.id
            ? " mr-auto rounded-tl-none"
            : " ml-auto text-right rounded-tr-none")
        }
      >
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a
              target="blank"
              rel="noreferrer noopener"
              href={decoratedHref}
              key={key}
              className="font-medium underline"
            >
              {decoratedText}
            </a>
          )}
        >
          <p className="text-sm whitespace-break-spaces break-words">
            {data.message}
          </p>
        </Linkify>
        <Content data={data.files} />
      </div>
    </div>
  );
}

export default Message;
