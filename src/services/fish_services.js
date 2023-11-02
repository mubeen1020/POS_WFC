import { useRecoilValue } from "recoil";
import { fishAtom } from "src/_state/fishAtom";
import apiClient from "src/helpers/apiClient";
class FishService {
    createfish = (data) => apiClient().post(`api/fish`, data);
    getfish = (search) => search ? apiClient().get(`api/fish/search?query=${search}`) : apiClient().get('api/fish');
    getfishbyId = (id) => apiClient().get("api/fish/" + id);
    getfishsettings = () => apiClient().get("api/fish/settings");
    deletefish = (id) => apiClient().delete("api/fish/" + id);
    updatefish = (id, data) => apiClient().put("api/fish/" + id, data);
    static Fishname(row){
        const fishData = useRecoilValue(fishAtom) || []
        if (fishData && Array.isArray(fishData)) {
        const filteredfish = fishData.filter(item => row.fish_ref == item.id);
        const fishNames = filteredfish.map(item => item.local_name);
        return fishNames;
    } else {
        return [];
    }
    }
    static fishnameno(row) {
        const fishData = useRecoilValue(fishAtom);
        const filteredfishpack = fishData.filter(item => row.fish_ref === item.id);
        const fishlocalname = filteredfishpack.map(item => item.local_name);
        const  fishfish_no= filteredfishpack.map(item => item.fish_no);
        const finalNames = fishlocalname.join('/') + ' / ' + fishfish_no.join('/');
        return finalNames;
    }

}

export default FishService;