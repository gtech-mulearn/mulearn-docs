import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Image src="/assets/MuLoader.gif" alt="Loader" height={400} width={400} unoptimized />
    </div>
  );
}
