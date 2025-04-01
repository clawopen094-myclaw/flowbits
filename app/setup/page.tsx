import { SetupUser } from "@/actions/billing/setupUser";
import { waitFor } from "@/lib/helper/waitFor";


export default async function SetupPage() {
    await waitFor(2000)
  return await SetupUser()
}