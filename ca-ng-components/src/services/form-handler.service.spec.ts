import { TestBed, waitForAsync } from '@angular/core/testing';
import { ShFormGroup } from '../utilities';
import { FormHandlerService } from './form-handler.service';
import { ValidatorHelper } from '@ca-webstack/ng-aspects';

class CustomerDTO {

    private _id: string;
    private _name: string = '';
    private _surname: string = '';
    private _email: string = '';
    private _phone: string = '';

    public constructor(initializer?: Partial<CustomerDTO>) {
        if (initializer && !(initializer instanceof CustomerDTO)) {
            for (const fieldName in initializer) {
                this[fieldName as keyof this] = (<any>initializer)[fieldName];
            }
        }
    }

    public get id(): string { return this._id; }
    public set id(value: string) { this._id = value; }

    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    public get surname(): string { return this._surname; }
    public set surname(value: string) { this._surname = value; }

    public get email(): string { return this._email; }
    public set email(value: string) { this._email = value; }

    public get phone(): string { return this._phone; }
    public set phone(value: string) { this._phone = value; }

}

describe('ShValidationService', () => {

    let formHandlerService: FormHandlerService;
    let customer: CustomerDTO;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            providers: [FormHandlerService, ValidatorHelper]
        }).compileComponents();
    }));


    beforeEach(() => {
        customer = new CustomerDTO({ name: 'John', surname: 'Doe' });
        formHandlerService = TestBed.inject(FormHandlerService);
    });

    describe('getGroup', () => {
        
        it('should return a group with autodestroy set to true if group is being internally created by service', () => {
            const group = formHandlerService.getGroup(customer, undefined, true) as ShFormGroup;
            expect(group).toBeDefined();
            expect(group).toBeInstanceOf(ShFormGroup);
            expect(group.autodestroy).toBeTrue();
        });

        it('should return a group with autodestroy set to false if group creation is requested externally', () => {
            const group = formHandlerService.getGroup(customer) as ShFormGroup;
            expect(group).toBeDefined();
            expect(group).toBeInstanceOf(ShFormGroup);
            expect(group.autodestroy).toBeFalse();
        });

        it('should return a group with autodestroy set to true for consecutive getGroup calls with truthy autodestroy parameter', () => {
            const group = formHandlerService.getGroup(customer, undefined, true);
            const existingGroup = formHandlerService.getGroup(customer, undefined, true) as ShFormGroup;
            expect(existingGroup).toBeDefined();
            expect(existingGroup).toBeInstanceOf(ShFormGroup);
            expect(existingGroup).toBe(group);
            expect(existingGroup.autodestroy).toBeTrue();
        });

        it('should return a group with autodestroy set to false for consecutive getGroup calls with falsy autodestroy parameter', () => {
            const group = formHandlerService.getGroup(customer);
            const existingGroup = formHandlerService.getGroup(customer) as ShFormGroup;
            expect(existingGroup).toBeDefined();
            expect(existingGroup).toBeInstanceOf(ShFormGroup);
            expect(existingGroup).toBe(group);
            expect(existingGroup.autodestroy).toBeFalse();
        });

        it('should return an existing group (whose creation has been requested externally) with autodestroy set to false even if autodestroy parameter is true', () => {
            const group = formHandlerService.getGroup(customer);
            const existingGroup = formHandlerService.getGroup(customer, undefined, true) as ShFormGroup;
            expect(existingGroup).toBeDefined();
            expect(existingGroup).toBeInstanceOf(ShFormGroup);
            expect(existingGroup).toBe(group);
            expect(existingGroup.autodestroy).toBeFalse();
        });

        it('should update group\'s autodestroy property (created internally) when it is requested externally', () => {
            const group = formHandlerService.getGroup(customer, undefined, true);
            const existingGroup = formHandlerService.getGroup(customer) as ShFormGroup;
            expect(existingGroup).toBeDefined();
            expect(existingGroup).toBeInstanceOf(ShFormGroup);
            expect(existingGroup).toBe(group);
            expect(existingGroup.autodestroy).toBeFalse();
        });

    });

});