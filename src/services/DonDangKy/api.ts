import axios from "axios";
import { Register } from "./typing";

const API_URL = "https://67f729c442d6c71cca6435b5.mockapi.io/api/clb/applications";

export const RegisterService = {
  getAllRegisters: async (): Promise<Register[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Bạn có thể thêm các method khác nếu muốn:
  getRegisterById: async (id: string): Promise<Register> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createRegister: async (data: Register): Promise<Register> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  updateRegister: async (id: string, data: Partial<Register>): Promise<Register> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteRegister: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
