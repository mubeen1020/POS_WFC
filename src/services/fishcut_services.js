import apiClient from "src/helpers/apiClient";
class FishCutsService {
    createfishCuts = (data) => apiClient().post(`api/fishCuts`, data);
    getfishCuts = (search) => search ? apiClient().get(`api/fishCuts/search?query=${search}`) : apiClient().get('api/fishCuts');
    getfishCutsbyId = (id) => apiClient().get("api/fishCuts/" + id);
    deletefishCuts = (id) => apiClient().delete("api/fishCuts/" + id);
    updatefishCuts = (id, data) => apiClient().put("api/fishCuts/" + id, data);

}

export default FishCutsService;