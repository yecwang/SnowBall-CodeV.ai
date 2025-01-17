// constants
import DialogOperation from 'src/constants/dialog-operation';
// redux
import { useSelector } from 'src/redux/store';
//
import DeletePageDialog from "./delete-page-dialog";

export default function NavDialog() {
  const { operation } = useSelector(store => store.navDialog);
  if(!operation) return null;

  return <>
    {operation === DialogOperation.DELETE_PAGE && <DeletePageDialog />}
  </>
}
