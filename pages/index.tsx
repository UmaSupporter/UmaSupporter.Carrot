import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className={"container mx-auto px-4 py-8"}>
      <h1 className={"text-3xl font-black"}>UmaSupporter.Carrot</h1>
      <p className={"text-xl"}>ππ½ββοΈ μ°λ§λ¬΄μ€λ© μ‘μ± λμ°λ―ΈμΈ &apos;μ°λ§μν¬ν°&apos;μ μ€νΌλ μ΄ν ν΄μλλ€.</p>

      <div className={"py-4 inline-flex flex-col gap-4"}>
        <Link href={"/refresh"}>
          <a className={"btn btn-primary"}>μΉ΄λ / μ°λ§ μ λ³΄ μλ°μ΄νΈνκΈ°</a>
        </Link>
        <Link href={"/upload"}>
          <a className={"btn btn-primary"}>μ΄λ―Έμ§ μλ‘λνκΈ°</a>
        </Link>
      </div>
    </div>
  );
};

export default Home;
