// initModel.js

// import Audit from './audit.js';

import City from './city.js';
import Determination from './determination.js';
import DeterminationsExam from './determinationsExam.js';
import Diagnosis from './diagnosis.js';
import Doctor from './doctor.js';
import Exam from './exam.js';
import Order from './order.js';
import Patient from './patient.js';
import Profile from './profile.js';
import ReferenceValue from './referenceValue.js';
import Result from './result.js';
import Sample from './sample.js';
import SampleType from './samplesType.js';
import State from './state.js';
import Studie from './studie.js';
//import Session from './session.js';
import Unit from './unit.js';
import User from './user.js';


class InitModels {
  constructor(sequelize) {
    this.init(sequelize);
    this.associate();
  }
  init(sequelize) {
    //     this.audit = Audit.initModel(sequelize);
    this.city = City.initModel(sequelize);
    this.determination = Determination.initModel(sequelize);
    this.determinationsExam = DeterminationsExam.initModel(sequelize);
    this.diagnosis = Diagnosis.initModel(sequelize);
    this.doctor = Doctor.initModel(sequelize);
    this.exam = Exam.initModel(sequelize);
    this.order = Order.initModel(sequelize);
    this.patient = Patient.initModel(sequelize);
    this.profile = Profile.initModel(sequelize);
    this.referenceValue = ReferenceValue.initModel(sequelize);
    this.result = Result.initModel(sequelize);
    this.sample = Sample.initModel(sequelize);
    this.sampleType = SampleType.initModel(sequelize);
    this.state = State.initModel(sequelize);
    this.studie = Studie.initModel(sequelize);
    this.unit = Unit.initModel(sequelize);
    this.user = User.initModel(sequelize);
    //  this.session = Session.initModel(sequelize);
  }
  associate() {
    this.patient.belongsTo(this.city, { as: "city", foreignKey: "citys_id" });
    this.city.hasMany(this.patient, { as: "patients", foreignKey: "citys_id" });
    this.user.belongsTo(this.city, { as: "city", foreignKey: "citysId" });
    this.city.hasMany(this.user, { as: "users", foreignKey: "citysId" });
    this.determinationsExam.belongsTo(this.determination, { as: "determination", foreignKey: "determinations_id" });
    this.determination.hasMany(this.determinationsExam, { as: "determinationsExam", foreignKey: "determinations_id" });
    this.referenceValue.belongsTo(this.determination, { as: "determination", foreignKey: "determinations_id" });
    this.determination.hasMany(this.referenceValue, { as: "referenceValue", foreignKey: "determinations_id" });
    this.result.belongsTo(this.determination, { as: "determination", foreignKey: "determinations_id" });
    this.determination.hasMany(this.result, { as: "results", foreignKey: "determinations_id" });
    this.order.belongsTo(this.diagnosis, { as: "diagnosis", foreignKey: "diagnosisId" });
    this.diagnosis.hasMany(this.order, { as: "orders", foreignKey: "diagnosisId" });
    this.order.belongsTo(this.doctor, { as: "doctor", foreignKey: "doctorsId" });
    this.doctor.hasMany(this.order, { as: "orders", foreignKey: "doctorsId" });
    this.determinationsExam.belongsTo(this.exam, { as: "exam", foreignKey: "exams_id" });
    this.exam.hasMany(this.determinationsExam, { as: "determinationsExam", foreignKey: "exams_id" });
    this.studie.belongsTo(this.exam, { as: "exam", foreignKey: "exams_id" });
    this.exam.hasMany(this.studie, { as: "studies", foreignKey: "exams_id" });
    this.sample.belongsTo(this.order, { as: "order", foreignKey: "orders_id" });
    this.order.hasMany(this.sample, { as: "samples", foreignKey: "orders_id" });
    this.studie.belongsTo(this.order, { as: "order", foreignKey: "orders_id" });
    this.order.hasMany(this.studie, { as: "studies", foreignKey: "orders_id" });
    this.order.belongsTo(this.patient, { as: "patient", foreignKey: "patientsId" });
    this.patient.hasMany(this.order, { as: "orders", foreignKey: "patientsId" });
    this.result.belongsTo(this.referenceValue, { as: "referenceValue", foreignKey: "reference_values_id" });
    this.referenceValue.hasMany(this.result, { as: "results", foreignKey: "reference_values_id" });
    this.exam.belongsTo(this.sampleType, { as: "sampleType", foreignKey: "samples_type_id" });
    this.sampleType.hasMany(this.exam, { as: "exams", foreignKey: "samples_type_id" });
    this.sample.belongsTo(this.sampleType, { as: "sampleType", foreignKey: "samples_type_id" });
    this.sampleType.hasMany(this.sample, { as: "samples", foreignKey: "samples_type_id" });
    this.city.belongsTo(this.state, { as: "state", foreignKey: "statesId" });
    this.state.hasMany(this.city, { as: "cities", foreignKey: "statesId" });
    this.result.belongsTo(this.studie, { as: "studie", foreignKey: "studies_id" });
    this.studie.hasMany(this.result, { as: "results", foreignKey: "studies_id" });
    this.referenceValue.belongsTo(this.unit, { as: "unit", foreignKey: "units_id" });
    this.unit.hasMany(this.referenceValue, { as: "referenceValue", foreignKey: "units_id" });
    this.order.belongsTo(this.user, { as: "user", foreignKey: "usersId" });
    this.user.hasMany(this.order, { as: "orders", foreignKey: "usersId" });
    this.profile.belongsTo(this.user, { as: "users", foreignKey: "users_id" });
    this.user.hasMany(this.profile, { as: "profiles", foreignKey: "users_id" });
    this.exam.belongsToMany(this.determination, { through: this.determinationsExam, as: 'determinations', foreignKey: 'exams_id' });
    this.determination.belongsToMany(this.exam, { through: this.determinationsExam, as: 'exams', foreignKey: 'determinations_id' });
  }
  static getModels(sequelize) {
    return new InitModels(sequelize);
  }
}
export default InitModels;
