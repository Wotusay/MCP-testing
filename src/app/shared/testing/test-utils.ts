import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Test utility functions for Angular component testing
 */
export class TestUtils {
  /**
   * Get element by CSS selector
   */
  static querySelector<T extends HTMLElement, C = unknown>(
    fixture: ComponentFixture<C>,
    selector: string,
  ): T | null {
    return fixture.nativeElement.querySelector(selector);
  }

  /**
   * Get all elements by CSS selector
   */
  static querySelectorAll<T extends HTMLElement, C = unknown>(
    fixture: ComponentFixture<C>,
    selector: string,
  ): NodeListOf<T> {
    return fixture.nativeElement.querySelectorAll(selector);
  }

  /**
   * Get DebugElement by CSS selector
   */
  static debugElement(
    fixture: ComponentFixture<unknown>,
    selector: string,
  ): DebugElement | null {
    return fixture.debugElement.query(By.css(selector));
  }

  /**
   * Get all DebugElements by CSS selector
   */
  static debugElements(
    fixture: ComponentFixture<unknown>,
    selector: string,
  ): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(selector));
  }

  /**
   * Trigger click event on element
   */
  static click(element: HTMLElement | DebugElement): void {
    if (element instanceof HTMLElement) {
      element.click();
    } else {
      element.nativeElement.click();
    }
  }

  /**
   * Set input value and trigger events
   */
  static setInputValue(
    fixture: ComponentFixture<unknown>,
    selector: string,
    value: string,
  ): void {
    const input = TestUtils.querySelector<HTMLInputElement>(fixture, selector);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    }
  }

  /**
   * Wait for async operations to complete
   */
  static async waitForAsync(fixture: ComponentFixture<unknown>): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /**
   * Create spy object with specified methods
   */
  static createSpyObj<T>(
    baseName: string,
    methodNames: (keyof T)[],
  ): jasmine.SpyObj<T> {
    return jasmine.createSpyObj(baseName, methodNames as string[]);
  }

  /**
   * Assert element exists
   */
  static expectElementToExist(
    fixture: ComponentFixture<unknown>,
    selector: string,
  ): void {
    const element = TestUtils.querySelector(fixture, selector);
    expect(element).toBeTruthy();
  }

  /**
   * Assert element does not exist
   */
  static expectElementNotToExist(
    fixture: ComponentFixture<unknown>,
    selector: string,
  ): void {
    const element = TestUtils.querySelector(fixture, selector);
    expect(element).toBeFalsy();
  }

  /**
   * Assert element has text content
   */
  static expectElementToHaveText(
    fixture: ComponentFixture<unknown>,
    selector: string,
    expectedText: string,
  ): void {
    const element = TestUtils.querySelector(fixture, selector);
    expect(element?.textContent?.trim()).toBe(expectedText);
  }

  /**
   * Assert element contains text
   */
  static expectElementToContainText(
    fixture: ComponentFixture<unknown>,
    selector: string,
    expectedText: string,
  ): void {
    const element = TestUtils.querySelector(fixture, selector);
    expect(element?.textContent).toContain(expectedText);
  }
}
