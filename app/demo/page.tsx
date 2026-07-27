import homepageFontStyles from "./homepage-font-scope.module.css";
import { SavannahHomepage } from "@/components/demo/homepage";
export default function DemoHomepagePage() {
    return <div className={homepageFontStyles.homepageFontScope}>{<SavannahHomepage />}</div>;
}
