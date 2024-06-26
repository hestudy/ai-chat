import { useBoolean, useRequest } from "ahooks";
import { PropsWithChildren, ReactNode } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const PopoverConfirm = ({
  children,
  title,
  content,
  onConfirm,
}: PropsWithChildren<{
  title?: ReactNode;
  content?: ReactNode;
  onConfirm?: () => Promise<void>;
}>) => {
  const [open, openAc] = useBoolean(false);

  const { run, loading } = useRequest(
    async () => {
      await onConfirm?.();
      openAc.setFalse();
    },
    {
      manual: true,
    }
  );

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        openAc.set(v);
      }}
    >
      <PopoverTrigger
        onClick={(e) => {
          e.preventDefault();
          openAc.setTrue();
        }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-lg font-semibold">{title}</div>
        <small className="text-sm font-medium leading-none">{content}</small>
        <div className="flex justify-end space-x-2">
          <Button
            variant={"secondary"}
            onClick={(e) => {
              e.preventDefault();
              openAc.setFalse();
            }}
          >
            取消
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              run();
            }}
            disabled={loading}
          >
            确定
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverConfirm;
