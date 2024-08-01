/* Rutas protegidas con autenticación y autorización */
this.router.use('/admin', authzMiddleware.getRouter(['administrador', 'superadministrador', 'ceo']), adminRoute.getRouter());
this.router.use('/user', authzMiddleware.getRouter(['userRole']), userRoute.getRouter()); // Reemplaza 'userRole' por el rol adecuado
this.router.use('/profile', authzMiddleware.getRouter(['profileRole']), profileRoute.getRouter()); // Reemplaza 'profileRole' por el rol adecuado
this.router.use('/patient', authzMiddleware.getRouter(['patientRole']), patientRoute.getRouter()); // Reemplaza 'patientRole' por el rol adecuado
this.router.use('/order', authzMiddleware.getRouter(['orderRole']), orderRoute.getRouter()); // Reemplaza 'orderRole' por el rol adecuado
this.router.use('/doctor', authzMiddleware.getRouter(['doctorRole']), doctorRoute.getRouter()); // Reemplaza 'doctorRole' por el rol adecuado
this.router.use('/diagnosis', authzMiddleware.getRouter(['diagnosisRole']), diagnosisRoute.getRouter()); // Reemplaza 'diagnosisRole' por el rol adecuado
this.router.use('/sampleType', authzMiddleware.getRouter(['sampleTypeRole']), sampleTypeRoute.getRouter()); // Reemplaza 'sampleTypeRole' por el rol adecuado
this.router.use('/sample', authzMiddleware.getRouter(['sampleRole']), sampleRoute.getRouter()); // Reemplaza 'sampleRole' por el rol adecuado
this.router.use('/exam', authzMiddleware.getRouter(['examRole']), examRoute.getRouter()); // Reemplaza 'examRole' por el rol adecuado
this.router.use('/studie', authzMiddleware.getRouter(['studieRole']), studieRoute.getRouter()); // Reemplaza 'studieRole' por el rol adecuado
this.router.use('/determination', authzMiddleware.getRouter(['determinationRole']), determinationRoute.getRouter()); // Reemplaza 'determinationRole' por el rol adecuado
this.router.use('/result', authzMiddleware.getRouter(['resultRole']), resultRoute.getRouter()); // Reemplaza 'resultRole' por el rol adecuado
this.router.use('/referenceValue', authzMiddleware.getRouter(['referenceValueRole']), referenceValueRoute.getRouter()); // Reemplaza 'referenceValueRole' por el rol adecuado
this.router.use('/unit', authzMiddleware.getRouter(['unitRole']), unitRoute.getRouter()); // Reemplaza 'unitRole' por el rol adecuado

/* Ruta de ciudad sin protección adicional */
this.router.use('/city', cityRoute.getRouter());