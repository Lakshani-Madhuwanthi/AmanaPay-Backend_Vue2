import {FieldValidator} from "@/helpers/validators/fieldValidator";

export class ImageData {
    value
    image
    link
    originalImage
    isOriginal

    constructor() {
        this.value = ''
        this.image = ''
        this.link = new FieldValidator(/^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z\d.-]+(:\d+)?)((?:\/[+~%/.\w-_]*)?\??#?)?)$/ , 'Please enter a valid URL')
        this.originalImage = ''
        this.isOriginal = false
    }
}
