import {admin} from '../../lib/store';
import AdminUI from './ui';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!await admin())return <main className="activation"><a href="/">Back to the shop</a><h1>Owner sign-in required.</h1><p>Open the admin through the shop’s configured Cloudflare Access address and use your approved email. If you already signed in, check the Access settings.</p><p>The storefront is public; customer requests and product editing are private.</p></main>;
 return <AdminUI/>;
}
