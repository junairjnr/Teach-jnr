import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function NavbarComp({
  name,
  navigation,
}: {
  name: string;
  navigation: string;
}) {
  return (
    <div className="flex fixed text-white  items-center px-4 z-10 bg-[#03D3D4] w-[100%] h-[50px] gap-5 top-0 left-0">
      <div>
        <Link href={navigation}>
          <IoMdArrowRoundBack className="items-center mt-1" size={25} />
        </Link>
      </div>
      <p className="text-xl font-bold items-center">{name}</p>
    </div>
  );
}
