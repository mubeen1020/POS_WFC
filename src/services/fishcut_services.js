import { useRecoilValue } from "recoil";
import { fishcutAtom } from "src/_state/fishcutAtom";
import apiClient from "src/helpers/apiClient";
class FishCutsService {
    createfishCuts = (data) => apiClient().post(`api/fishCuts`, data);
    getfishCuts = (search) => search ? apiClient().get(`api/fishCuts/search?query=${search}`) : apiClient().get('api/fishCuts');
    getfishCutsbyId = (id) => apiClient().get("api/fishCuts/" + id);
    deletefishCuts = (id) => apiClient().delete("api/fishCuts/" + id);
    updatefishCuts = (id, data) => apiClient().put("api/fishCuts/" + id, data);
    static Fishcutname(row){
        const fishcutData = useRecoilValue(fishcutAtom)
        const filteredfishcut = fishcutData.filter(item => row.fish_cut == item.id);
        const fishcutNames = filteredfishcut.map(item => item.fish_cut);
        return fishcutNames;
    }
}

export default FishCutsService;