import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * This class is used to check the loaded svgs. If the svg exists in the items object, it will not be loaded again.
 */
class IconMap {
  items: { [key: string]: MatIconRegistry } = {};

  /**
   * Check if the key exists.
   *
   * @param key Represents the name of the icon.
   */
  has(key: string): boolean {
    return key in this.items;
  }

  /**
   * Adds the icon.
   *
   * @param key Represents the name of the icon.
   * @param value Represents the icon as MatIconRegistry.
   */
  add(key: string, value: MatIconRegistry): void {
    this.items[key] = value;
  }

  /**
   * Gets the icon if exists.
   *
   * @param key Represents the name of the icon.
   *
   * @return The icon as MatIconRegistry.
   */
  get(key: string): MatIconRegistry | undefined {
    if (this.has(key)) {
      return this.items[key];
    }
    return undefined;
  }

  /**
   * Removes the icon if exists.
   *
   * @param key Represents the name of the icon.
   */
  remove(key: string): void {
    if (this.has(key)) {
      delete this.items[key];
    }
  }
}

/**
 * This service is used to get the custom icons(using svg).
 */
@Injectable()
export class CustomIconService {
  private iconMap = new IconMap();
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param matIconRegistry Is an instance of MatIconRegistry that allows to associate icon names with svg.
   * @param domSanitizer Is an instance of DomSanitizer.
   */
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  /**
   * Adds custom icons to the MatIconRegistry.
   *
   * @param icons Represents the icon name/array of the icons name.
   *
   * @return The icon/an array of icons.
   */
  addCustomIcons(icons: string): MatIconRegistry;
  addCustomIcons(icons: string[]): MatIconRegistry[];
  addCustomIcons(
    icons: string | string[]
  ): MatIconRegistry | MatIconRegistry[] {
    const res = (Array.isArray(icons) ? icons : [icons]).map(
      (iconName: string) => {
        if (this.iconMap.has(iconName)) {
          const icon = this.iconMap.get(iconName);
          if (icon !== undefined) {
            return icon;
          }
        }
        const icon = this.matIconRegistry.addSvgIcon(
          iconName,
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            '../../assets/svg/' + iconName + '.svg'
          )
        );
        this.iconMap.add(iconName, icon);
        return icon;
      }
    );
    return Array.isArray(icons) ? res : res[0];
  }

  /**
   * Fetch the icons.
   *
   * @param icons Represents the array of the icons name.
   */
  fetchCustomIcons(icons: string[]): void {
    for (const icon of icons) {
      this.matIconRegistry.getNamedSvgIcon(icon).subscribe();
      this.matIconRegistry
        .getSvgIconFromUrl(
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            '../../assets/svg/' + icon + '.svg'
          )
        )
        .subscribe();
    }
  }
}
