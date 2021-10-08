type PictureParams = {
  pictureUrl?: string;
  name?: string;
}

export class UserProfile {
  initials?: string;
  pictureUrl?: string;

  constructor(readonly id: string) {}

  setPicture({ pictureUrl, name }: PictureParams) {
    this.pictureUrl = pictureUrl;

    if (!pictureUrl && name) {
      let firstLetter: string;
      let lastLetter: string;

      const letters = name.match(/\b(.)/g) ?? [];

      if (letters.length > 1) {
        firstLetter = letters.shift() ?? '';
        lastLetter = letters.pop() ?? '';
      } else {
        firstLetter = name.substring(0, 1);
        lastLetter = name.substring(1, 2);
      }

      this.initials = `${firstLetter.toUpperCase()}${lastLetter.toUpperCase()}`;
    }
  }
}
