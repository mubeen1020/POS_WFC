import apiClient from "src/helpers/apiClient";
class SettingsService {
    createSettings = (data) => apiClient().post(`api/settings`, data);
    getSettingsbyId = (id) => apiClient().get("api/settings/" + id);
    updateSettings = (id, data) => apiClient().put("api/settings/" + id, data);

}

export default SettingsService;