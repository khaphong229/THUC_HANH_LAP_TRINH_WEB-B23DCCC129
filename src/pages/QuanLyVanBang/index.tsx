import { UseLocation } from "@sentry/react/types/types";
import { useLocation } from "react-router";
import SoVanBang from './SoVanBang';
import QuyetDinhTotNghiep from './QuyetDinhTotNghiep';
import ThongTinVanBang from './ThongTinVanBang';
import CauHinhBieuMau from './CauHinhBieuMau';
import TraCuuVanBang from './TraCuuVanBang';



export default function DegreeManagement(){
    const location = useLocation();
    const {pathname} = location;
    const renderComponent= () =>{
        if(pathname.includes('/quan-ly-so-van-bang')){
            return <SoVanBang/>
        }
        if(pathname.includes('/quyet-dinh-tot-nghiep')){
            return <QuyetDinhTotNghiep/>
        }
        if(pathname.includes('/thong-tin-van-bang')){
            return <ThongTinVanBang/>
        }
        if(pathname.includes('/tra-cuu-van-bang')){
            return <TraCuuVanBang/>
        }
        if(pathname.includes('/cau-hinh-bieu-mau')){
            return <CauHinhBieuMau/>
        }
        return <SoVanBang/>
    };
    return (
        <div>
            <h1>Hệ thống quản lý</h1>
            {renderComponent()}
        </div>
    )
}