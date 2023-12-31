import Header from "./components/Header";

function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <main>
      {/* As the Header and the div are same for both the menu and restaurant page, we have created a layout, and hence following the DRY (do not repeat yourself principle) */}
      <Header name={params.slug} />
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11 text-black">
        {children}
      </div>
    </main>
  );
}

export default Layout;
