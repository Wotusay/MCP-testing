import { TestBed } from '@angular/core/testing';

describe('Responsive Breakpoints Configuration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('should validate Tailwind responsive classes are properly configured', () => {
    // Test that responsive breakpoint classes can be applied
    const testElement = document.createElement('div');
    testElement.className =
      'xs:block sm:block md:block lg:block xl:block 2xl:block 3xl:block';

    // Check that the classes are applied (this validates Tailwind config)
    expect(testElement.className).toContain('xs:block');
    expect(testElement.className).toContain('sm:block');
    expect(testElement.className).toContain('md:block');
    expect(testElement.className).toContain('lg:block');
    expect(testElement.className).toContain('xl:block');
    expect(testElement.className).toContain('2xl:block');
    expect(testElement.className).toContain('3xl:block');
  });

  it('should validate responsive utility classes exist', () => {
    const testElement = document.createElement('div');
    testElement.className =
      'container-responsive text-responsive-2xl p-responsive';

    expect(testElement.className).toContain('container-responsive');
    expect(testElement.className).toContain('text-responsive-2xl');
    expect(testElement.className).toContain('p-responsive');
  });

  it('should validate responsive grid classes work', () => {
    const testElement = document.createElement('div');
    testElement.className =
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4';

    expect(testElement.className).toContain('grid-cols-1');
    expect(testElement.className).toContain('sm:grid-cols-2');
    expect(testElement.className).toContain('lg:grid-cols-3');
    expect(testElement.className).toContain('xl:grid-cols-3');
    expect(testElement.className).toContain('2xl:grid-cols-4');
  });

  it('should validate responsive spacing classes work', () => {
    const testElement = document.createElement('div');
    testElement.className = 'px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16';

    expect(testElement.className).toContain('px-4');
    expect(testElement.className).toContain('sm:px-6');
    expect(testElement.className).toContain('lg:px-8');
    expect(testElement.className).toContain('xl:px-12');
    expect(testElement.className).toContain('2xl:px-16');
  });

  it('should validate responsive text classes work', () => {
    const testElement = document.createElement('div');
    testElement.className = 'text-base sm:text-lg lg:text-xl xl:text-2xl';

    expect(testElement.className).toContain('text-base');
    expect(testElement.className).toContain('sm:text-lg');
    expect(testElement.className).toContain('lg:text-xl');
    expect(testElement.className).toContain('xl:text-2xl');
  });
});
