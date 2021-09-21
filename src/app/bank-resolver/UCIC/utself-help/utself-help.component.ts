import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { mm_vill, ShowMessage, SystemValues } from '../../Models';
import { mm_shg } from '../../Models/mm_shg';
import { mm_shg_member } from '../../Models/mm_shg_member';

@Component({
  selector: 'app-utself-help',
  templateUrl: './utself-help.component.html',
  styleUrls: ['./utself-help.component.css']
})
export class UTSelfHelpComponent implements OnInit {

  constructor(private svc: RestService, private frmBldr: FormBuilder,private modalService: BsModalService,
    private router: Router) { }
  get f() { return this.shgFrm.controls; }
  shgFrm: FormGroup;
  branchCode = '0';
  userName = '';
  sys = new SystemValues();
  isLoading = false;
  showMsg: ShowMessage;
  mmshg = new mm_shg();
  mmshgmember: mm_shg_member[] = [];
  villageList:mm_vill[]=[];
  ngOnInit(): void {
    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId;
    this.shgFrm = this.frmBldr.group({
     shg_id : [], 
     brn_cd : [],   
     chairman_name : [],        
     secretary_name : [],       
     village : [],              
     gruop_sex : [],            
      monthly_subcription : [], 
      min_member_limit : [],    
      male_member : [],         
      female_member : [],       
      caste_sc : [],            
      caste_st : [],            
      caste_gen : [],           
      caste_muslim : [],        
     form_dt : [],            
     sb_accno : []            
    });
    // this.onShgMemberCreation = this.formBuilder.group({
    //   'ShgMemberF': this.formBuilder.array([
    //     this.addshgMemberFromGroup()
    //   ])
    // });
  }

  // addshgMemberFromGroup(): FormGroup 
  // return this.formBuilder.group({
  //  shg_id : [null, null],           
  //  shg_member_id : [null, null],    
  //  shg_member_name : [null, null],   
  //  guardian_name : [null, null],     
  //  shg_member_sex : [null, null],    
  //  shg_member_caste : [null, null],  
  //  religion : [null, null],	         
  //  date_of_join : [null, null],     
  //  education : [null, null],         
  //  brn_cd : [null, null],            
  //  status : [null, null],            
  //  date_of_birth : [null, null],    
  //  age : [null, null],              
  //  widow : [null, null],             
  //  toilet_flag : [null, null],       
  //  mobile : [null, null],           
  //  adhar_no : [null, null],         
  //  pan : [null, null],               
  //  disability_remarks : [null, null],
  //  training_remarks : [null, null]
  //   });

  setShgMemberGroupSex(gender: string) 
  {
    //this.neftPayRet.payment_type = accType;
  }
  setShgMemberSex(gender: string) 
  {
    //this.neftPayRet.payment_type = accType;
  }
  setShgMemberCaste(caste: string) 
  {
    //this.neftPayRet.payment_type = accType;
  }
  setShgMemberReligion(religion: string) 
  {
    //this.neftPayRet.payment_type = accType;
  }
  setShgMemberEducation(education: string) 
  {
    //this.neftPayRet.payment_type = accType;
  }
  setShgMemberWidow(widow: string) 
  {
    //this.neftPayRet.payment_type = accType;
  }
  setShgMemberToilet(toilet: string) 
  {
    //this.neftPayRet.payment_type = accType;
  }
  setVillage()
  {}
  addShgMember()
  {
    let alreadyHasEmptyDenominationItem = false;
    //if (this.mmshgmember.length >= 1) {
      // check if tm_denominationList has any blank items
    //   this.tm_denominationList.forEach(element => {
    //     if (!alreadyHasEmptyDenominationItem) {
    //       if (undefined === element.rupees
    //         || undefined === element.count
    //         || undefined === element.total) { alreadyHasEmptyDenominationItem = true; }
    //     }
    //   });
    // }
    if (alreadyHasEmptyDenominationItem) { return; }

    const temp_mmshgmember = new mm_shg_member();
    temp_mmshgmember.brn_cd = localStorage.getItem('__brnCd');
    temp_mmshgmember.shg_id = 0;
    this.mmshgmember.push(temp_mmshgmember);
  }
  removeShgMember()
  {
    if (this.mmshgmember.length >= 1) {
      this.mmshgmember.pop();
    }
  }
  retrieveData(){}
  clearData(){}
  saveData(){}
  deleteData(){}
  backScreen(){this.router.navigate([this.sys.BankName + '/la']);}

}
