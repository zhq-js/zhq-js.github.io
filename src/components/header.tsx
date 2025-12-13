import { Github } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex flex-col justify-center items-center text-primary-foreground lg:gap-4 gap-1 lg:h-40 h-25">
      <Link
        href={"https://github.com/yiming-liao/zhq"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 group"
      >
        <h1 className="w-fit text-4xl group-hover:scale-x-110 duration-500">
          ZHQ
        </h1>
        <Github className="size-7 mt-1 group-hover:animate-spin animate-pulse" />
      </Link>

      <p className="text-primary-foreground/75 font-medium">
        互動式問答 Chatbot
      </p>
    </div>
  );
}
