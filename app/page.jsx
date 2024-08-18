import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import LoadCategories from "@/components/LoadCategories";

export default function Home() {
  return (
    <>
      <Header />
      <div className=" flex items-center justify-center flex-col w-full">
        <h1 className="mb-4 text-2xl">Hello there,</h1>
        <h1 className="mb-9 text-xl md:text-4xl text-center">
          Welcome to <span>Wellmark Technologies Admin Panel</span>!
        </h1>
        <div className="max-w-7xl w-full">
          <div className="flex justify-between items-center ">
            <h2>Categories:</h2>
            <AddButton type="category" action="Add" />
          </div>
          <div className="border-4 border-[#5eb1af] rounded-xl px-4 py-6 mt-6 ">
            <LoadCategories />
          </div>
        </div>
      </div>
    </>
  );
}
