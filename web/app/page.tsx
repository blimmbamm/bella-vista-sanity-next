import { redirect } from "next/navigation";
import { DEFAULT_LANG } from "../i18n/i18n";

/** Static export: `/` always goes to the default language. */
export default function RootPage() {
  redirect(`/${DEFAULT_LANG}`);
}
