import { redirect } from 'next/navigation';
import setting from 'src/project/setting/index.json'
import { paths } from 'src/routes/paths';
// ----------------------------------------------------------------------

export default async function HomePage() {
  const defaultPageID = setting.entryPage
  if (!defaultPageID) {
    redirect(paths.page404)
    return
  }
  const path = paths.home.pages(defaultPageID)
  redirect(path)
}
