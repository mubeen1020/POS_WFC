import apiClient from "src/helpers/apiClient";
class FishpackService {
    createfishpack = (data) => apiClient().post(`api/fishpack`, data);
    getfishpack = (search) => search ? apiClient().get(`api/fishpack/search?query=${search}`) : apiClient().get('api/fishpack');
    getfishpackbyId = (id) => apiClient().get("api/fishpack/" + id);
    deletefishpack = (id) => apiClient().delete("api/fishpack/" + id);
    updatefishpack = (id, data) => apiClient().put("api/fishpack/" + id, data);
}

export default FishpackService;