import { useRecoilValue } from "recoil";
import { fishAtom } from "src/_state/fishAtom";
import { fishcutAtom } from "src/_state/fishcutAtom";
import { fishpackAtom } from "src/_state/fishpackAtom";
import apiClient from "src/helpers/apiClient";
class FishpackService {
    createfishpack = (data) => apiClient().post(`api/fishpack`, data);
    getfishpack = (search) => search ? apiClient().get(`/api/fishpack/search?fishRef=${search}`) : apiClient().get('api/fishpack');
    getfishpackbyId = (id) => apiClient().get("api/fishpack/" + id);
    getfishmin_max_rate = () => apiClient().get("api/fishpack/min_max_purchaserate");
    deletefishpack = (id) => apiClient().delete("api/fishpack/" + id);
    updatefishpack = (id, data) => apiClient().put("api/fishpack/" + id, data);
    static fishpackname(row) {
        const fishData = useRecoilValue(fishAtom);
        const fishpackdata = useRecoilValue(fishpackAtom);
        const fishcutdata = useRecoilValue(fishcutAtom);
        const filteredfishpack = fishpackdata.filter(item => row.fish_pack_ref === item.id);
        const fishIds = [...new Set(filteredfishpack.map(item => item.fish_ref))];
        const matchingfish = fishData.filter(item => fishIds.includes(item.id));
        const fishcutIds = [...new Set(filteredfishpack.map(item => item.fish_cut))];
        const fishcutIdsAsNumbers = fishcutIds.map(Number);
        const matchingfishcut = fishcutdata.filter(item => fishcutIdsAsNumbers.includes(item.id));
        const finalfishNames = matchingfish.map(item => item.local_name);
        const finalfishcutNames = matchingfishcut.map(item => item.fish_cut);
        const finalNames = finalfishNames.join('/') + ' / ' + finalfishcutNames.join('/');
        return finalNames;
    }



}

export default FishpackService;