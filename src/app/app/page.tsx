import { assets } from "@/assets";
import RetroGrid from "@/components/ui/magicui/retro-grid";
import ShimmerButton from "@/components/ui/magicui/shimmer-button";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="h-full">
      <div className="relative h-full">
        <div className="absolute z-[999] w-full h-full">
          <div className="mx-auto w-[400px] h-full flex flex-col justify-center items-center">
            <Image src={assets.logo} alt="logo" className="w-full"></Image>
            <Link href={"/app/chat"}>
              <ShimmerButton>开始聊天</ShimmerButton>
            </Link>
          </div>
        </div>
        <RetroGrid></RetroGrid>
      </div>
    </div>
  );
};

export default page;
