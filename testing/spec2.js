
describe('bugs homepage', function() {
  it('should click', function() {
	browser.get('http://localhost:3000/#!/groups/create');
	element(by.id('name')).sendKeys('cop4600');
	element(by.id('description')).sendKeys('This is really operating systems, but for the sake of the test, roll with it.');
	browser.driver.sleep(2000);		
    browser.get('http://localhost:3000/#!/groups');
    browser.driver.sleep(2000);	
    browser.get('http://localhost:3000/#!/groups/classes');
    browser.driver.sleep(2000);	   
	
  });
});