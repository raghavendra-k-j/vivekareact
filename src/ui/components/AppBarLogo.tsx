import { ServiceUrl } from "~/infra/datasources/ServiceUrl";
import { BaseEnv } from "~/core/config/BaseEnv";
import { useAppStore } from "../portal/layout/app/AppContext";
import { CssSize, toCssSize } from "../types/css";

function AppBarLogo() {
    return (<a href="/" onClick={(e) => e.preventDefault()}>
        <div className="font-bold text-xl flex flex-row items-center gap-2 select-none" style={{ color: "white" }}>
            <PngLogo />
        </div>
    </a>);
}

export default AppBarLogo;





export function PngLogo() {
    return (
        <div className="h-[32px] max-h-[32px] flex items-center overflow-hidden">
            <LogoPng />
        </div>
    );
}


function LogoPng() {
    const appStore = useAppStore();
    let logoUrl = "./logo_sidebar.png";
    let altText = `${BaseEnv.instance.productName} Logo`;
    if (appStore.orgConfig.org.hasLogoUrl) {
        logoUrl = ServiceUrl.getUrl(`/${appStore.orgConfig.org.logoUrl!}`);
        altText = `${appStore.orgConfig.org.name} Logo`;
    }
    return (
        <img
            src={logoUrl}
            alt={altText}
            className="w-full h-[32px] object-contain"
            style={{ maxHeight: "32px" }}
        />
    );
}


export function ProductLogoPng({ width = "auto", height = "auto" }: { width?: CssSize, height?: CssSize }) {
    const widthCss = toCssSize(width);
    const heightCss = toCssSize(height);
    return (<img src="./logo_sidebar.png" alt="Viveka Logo" style={{ width: widthCss, height: heightCss, objectFit: "contain" }} />);
}




// const LogoSvg = (props: React.SVGProps<SVGSVGElement>) => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         xmlSpace="preserve"
//         fill="currentColor"
//         viewBox="0 0 512 512"
//         {...props}
//     >
//         <path d="m256 350.349-.001-.001.001.001zM256 350.349l.001-.001-.001.001z" />
//         <path d="M256 94.349s-67.301 57.307-67.301 128 67.301 128 67.301 128 67.301-57.307 67.301-128-67.301-128-67.301-128zM195.334 332.483c-11.322-15.587-20.403-31.598-26.991-47.59-8.648-20.99-13.034-42.033-13.034-62.543 0-13.635 1.95-27.504 5.789-41.438-43.015-15.027-86.116-11.581-86.116-11.581s-7.067 88.111 42.921 138.099c25.49 25.49 60.889 36.139 89.466 40.461a282.178 282.178 0 0 1-12.035-15.408zM178.096 376.052c-34.412-8.672-62.609-23.815-83.806-45.013-9.641-9.641-18.07-20.827-25.207-33.395C28.041 317.434 0 350.349 0 350.349s57.307 67.301 128 67.301c36.05 0 68.614-17.501 91.877-34.656-12.471-1.09-26.795-3.166-41.781-6.942zM437.019 169.331s-43.102-3.446-86.116 11.581c3.839 13.933 5.789 27.803 5.789 41.438 0 20.51-4.385 41.553-13.034 62.543-6.588 15.992-15.669 32.003-26.991 47.59a282.285 282.285 0 0 1-12.035 15.408c28.577-4.322 63.977-14.972 89.466-40.461 49.987-49.989 42.921-138.099 42.921-138.099zM442.917 297.645c-7.137 12.567-15.566 23.753-25.207 33.395-21.197 21.198-49.394 36.341-83.806 45.013-14.986 3.777-29.31 5.852-41.781 6.943 23.264 17.154 55.827 34.656 91.877 34.656 70.693 0 128-67.301 128-67.301s-28.041-32.917-69.083-52.706z" />
//     </svg>
// );

// function FullSvgLogo() {
//     return (<>
//         <span className="flex items-center justify-center" style={{ width: "32px", height: "32px" }}>
//             <LogoSvg />
//         </span>
//         <span>Viveka</span>
//     </>);
// }

