import { ImageDTO } from './image-dto.model';

export class HostDTO {
  name: string;
  image: ImageDTO;
  os_type?: string;
  gui_access?: boolean;
}
