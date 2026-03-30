import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function PaginacionProductos({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {/* Anterior */}
        <PaginationItem>
          {currentPage > 1 ? (
            <Button variant="ghost" size="default" asChild className="pl-2">
              <Link href={`?page=${currentPage - 1}`}>
                <ChevronLeftIcon className="size-4" />
                <span className="hidden sm:block">Anterior</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="default" disabled className="pl-2 opacity-50">
              <ChevronLeftIcon className="size-4" />
              <span className="hidden sm:block">Anterior</span>
            </Button>
          )}
        </PaginationItem>

        {/* Números de página */}
        {pages.map((page, i) => (
          <PaginationItem key={i}>
            {page === "..." ? (
              <span className="flex size-9 items-center justify-center text-muted-foreground">
                <MoreHorizontalIcon className="size-4" />
              </span>
            ) : page === currentPage ? (
              <Button variant="outline" size="icon" className="size-9 font-semibold" disabled>
                {page}
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="size-9" asChild>
                <Link href={`?page=${page}`}>{page}</Link>
              </Button>
            )}
          </PaginationItem>
        ))}

        {/* Siguiente */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <Button variant="ghost" size="default" asChild className="pr-2">
              <Link href={`?page=${currentPage + 1}`}>
                <span className="hidden sm:block">Siguiente</span>
                <ChevronRightIcon className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="default" disabled className="pr-2 opacity-50">
              <span className="hidden sm:block">Siguiente</span>
              <ChevronRightIcon className="size-4" />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
