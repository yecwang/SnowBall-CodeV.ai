//
import Header from './header';
import Main from './main';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  )
}
